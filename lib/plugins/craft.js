const assert = require('assert')
const { once } = require('events')
const { callbackify } = require('../promise_utils')

module.exports = inject

function inject(bot, { version }) {
  const Item = require('prismarine-item')(version)
  const Recipe = require('prismarine-recipe')(version).Recipe

  async function craft(recipe, count, craftingTable) {
    assert.ok(recipe)
    count = parseInt(count ?? 1, 10)
    if (recipe.requiresTable && !craftingTable) {
      throw new Error('recipe requires craftingTable')
    }
    for (let i = 0; i < count; i++) {
      console.log({ createNthTime: i })
      await craftOnce(recipe, craftingTable)
    }
  }

  async function craftOnce(recipe, craftingTable) {
    if (craftingTable) {
      bot.activateBlock(craftingTable)
      console.log('activating crafting table')
      const [window] = await once(bot, 'windowOpen')
      if (!window.type.startsWith('minecraft:crafting')) {
        throw new Error('crafting: non craftingTable used as craftingTable')
      }
      console.log('startclicking start')
      await startClicking(window, 3, 3)
    } else {
      console.log('startclicking start')
      await startClicking(bot.inventory, 2, 2)
      console.log('startclicking done')
    }

    async function startClicking(window, w, h) {
      console.log({ beforeItemCreation: window.slots[0] })
      const extraSlots = unusedRecipeSlots()
      let ingredientIndex = 0
      let originalSourceSlot = null
      let it
      if (recipe.inShape) {
        it = {
          x: 0,
          y: 0,
          row: recipe.inShape[0]
        }
        await clickShape()
      } else {
        console.log('nextIngredientCall start')
        await nextIngredientsClick()
        console.log('nextIngredientCall Done')
      }

      function incrementShapeIterator() {
        it.x += 1
        if (it.x >= it.row.length) {
          it.y += 1
          if (it.y >= recipe.inShape.length) return null
          it.x = 0
          it.row = recipe.inShape[it.y]
        }
        return it
      }

      async function nextShapeClick() {
        if (incrementShapeIterator()) {
          await clickShape()
        } else if (!recipe.ingredients) {
          await putMaterialsAway()
        } else {
          console.log('nextIngredientCall start')
          await nextIngredientsClick()
          console.log('nextIngredientCall Done')
        }
      }

      async function clickShape() {
        const destSlot = slot(it.x, it.y)
        const ingredient = it.row[it.x]
        if (ingredient.id === -1) return nextShapeClick()
        if (!window.selectedItem || window.selectedItem.type !== ingredient.id ||
          (ingredient.metadata != null &&
            window.selectedItem.metadata !== ingredient.metadata)) {
          // we are not holding the item we need. click it.
          const sourceItem = window.findInventoryItem(ingredient.id, ingredient.metadata)
          if (!sourceItem) throw new Error('missing ingredient')
          if (originalSourceSlot == null) originalSourceSlot = sourceItem.slot
          await bot.asyncClickWindow(sourceItem.slot, 0, 0)
        }
        await bot.asyncClickWindow(destSlot, 1, 0)
        await nextShapeClick()
      }

      async function nextIngredientsClick() {
        const ingredient = recipe.ingredients[ingredientIndex]
        const destSlot = extraSlots.pop()
        if (!window.selectedItem || window.selectedItem.type !== ingredient.id ||
          (ingredient.metadata != null &&
            window.selectedItem.metadata !== ingredient.metadata)) {
          // we are not holding the item we need. click it.
          console.log('not holding item needed')
          const sourceItem = window.findInventoryItem(ingredient.id, ingredient.metadata)
          if (!sourceItem) throw new Error('missing ingredient')
          if (originalSourceSlot == null) originalSourceSlot = sourceItem.slot
          await bot.asyncClickWindow(sourceItem.slot, 0, 0)
        }
        console.log('holding item needed')
        console.log({ beforeItemCreation: window.slots[0] })
        console.log({ selectingSlot: destSlot })
        await bot.asyncClickWindow(destSlot, 1, 0)
        console.log({ afterItemCreation: window.slots[0] })
        console.log('click window done')
        console.log({ ingredientIndex })
        if (++ingredientIndex < recipe.ingredients.length) {
          console.log({ ingredientIndex })
          await nextIngredientsClick()
        } else {
          console.log('put materials away start')
          await putMaterialsAway()
          console.log('put materials away end')
        }
      }

      async function putMaterialsAway() {
        const start = window.inventoryStart
        const end = window.inventoryEnd
        // console.log({ window })
        console.log({ putMaterialsAway: { start, end } })
        console.log('putSelectItemRange Start')
        await bot.putSelectedItemRange(start, end, window, originalSourceSlot)
        console.log('putSelectItemRange Done')
        //console.log({ window })
        console.log('grab result start')
        await grabResult()
        console.log('grab result end')
      }

      async function grabResult() {
        assert.strictEqual(window.selectedItem, null)
        console.log({ beforeItemCreation: window.slots[0] })
        // put the recipe result in the output
        // TODO: why do this if it already exists?
        const item = new Item(recipe.result.id, recipe.result.count, recipe.result.metadata)
        window.updateSlot(0, item)
        console.log('after update slot 0')
        // console.log({ window })
        // move the result to inventory
        console.log('put away start')
        await bot.putAway(0)
        console.log('put away done')
        console.log('update out shape start')
        await updateOutShape()
        console.log('update out shape done')
      }

      async function updateOutShape() {
        if (!recipe.outShape) {
          for (let i = 1; i <= w * h; i++) {
            window.updateSlot(i, null)
          }
          closeTheWindow()
          return
        }
        const slotsToClick = []
        let x
        let y
        let row
        let item
        let theSlot
        for (y = 0; y < recipe.outShape.length; ++y) {
          row = recipe.outShape[y]
          for (x = 0; x < row.length; ++x) {
            theSlot = slot(x, y)
            if (row[x].id !== -1) {
              item = new Item(row[x].id, row[x].count, row[x].metadata || null)
              slotsToClick.push(theSlot)
            } else {
              item = null
            }
            window.updateSlot(theSlot, item)
          }
        }
        theSlot = slotsToClick.pop()
        while (theSlot) {
          await bot.putAway(theSlot)
          theSlot = slotsToClick.pop()
        }
        closeTheWindow()
      }

      function closeTheWindow() {
        bot.closeWindow(window)
      }

      function slot(x, y) {
        return 1 + x + w * y
      }

      function unusedRecipeSlots() {
        const result = []
        let x
        let y
        let row
        if (recipe.inShape) {
          for (y = 0; y < recipe.inShape.length; ++y) {
            row = recipe.inShape[y]
            for (x = 0; x < row.length; ++x) {
              if (row[x].id === -1) result.push(slot(x, y))
            }
            for (; x < w; ++x) {
              result.push(slot(x, y))
            }
          }
          for (; y < h; ++y) {
            for (x = 0; x < w; ++x) {
              result.push(slot(x, y))
            }
          }
        } else {
          for (y = 0; y < h; ++y) {
            for (x = 0; x < w; ++x) {
              result.push(slot(x, y))
            }
          }
        }
        return result
      }
    }
  }

  function recipesFor(itemType, metadata, minResultCount, craftingTable) {
    minResultCount = minResultCount ?? 1
    const results = []
    Recipe.find(itemType, metadata).forEach((recipe) => {
      if (requirementsMetForRecipe(recipe, minResultCount, craftingTable)) {
        results.push(recipe)
      }
    })
    return results
  }

  function recipesAll(itemType, metadata, craftingTable) {
    const results = []
    Recipe.find(itemType, metadata).forEach((recipe) => {
      if (!recipe.requiresTable || craftingTable) {
        results.push(recipe)
      }
    })
    return results
  }

  function requirementsMetForRecipe(recipe, minResultCount, craftingTable) {
    if (recipe.requiresTable && !craftingTable) return false

    // how many times we have to perform the craft to achieve minResultCount
    const craftCount = Math.ceil(minResultCount / recipe.result.count)

    // false if not enough inventory to make all the ones that we want
    for (let i = 0; i < recipe.delta.length; ++i) {
      const d = recipe.delta[i]
      if (bot.inventory.count(d.id, d.metadata) + d.count * craftCount < 0) return false
    }

    // otherwise true
    return true
  }

  bot.craft = callbackify(craft)
  bot.recipesFor = recipesFor
  bot.recipesAll = recipesAll
}
