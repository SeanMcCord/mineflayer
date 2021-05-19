I changed the externalTests file to filter to just the crafting test

Run it like 
```
DEBUG="minecraft-protocol" npm test -- -g <version_number>
```

Example output
```
  minecraft-protocol writing packet play.chat +6ms
  minecraft-protocol { message: 'without a crafting table, I can make birch_planks' } +0ms
without a crafting table, I can make birch_planks
  minecraft-protocol writing packet play.window_click +0ms
  minecraft-protocol {
  minecraft-protocol   windowId: 0,
  minecraft-protocol   slot: 9,
  minecraft-protocol   mouseButton: 0,
  minecraft-protocol   action: 6,
  minecraft-protocol   mode: 0,
  minecraft-protocol   item: { present: true, itemId: 34, itemCount: 1 }
  minecraft-protocol } +0ms
[07:01:43] [Server thread/INFO]: <flatbot> did the recipe for birch_planks 1 times
[07:01:43] [Server thread/INFO]: <flatbot> without a crafting table, I can make birch_planks
  minecraft-protocol read packet play.chat +1ms
  minecraft-protocol {
  minecraft-protocol   "message": "{\"translate\":\"chat.type.text\",\"with\":[{\"insertion\":\"flatbot\",\"clickEvent\":{\"action\":\"suggest_command\",\"value\":\"/tell flatbot \"},\"hoverEvent\":{\"action\":\"show_entity\",\"value\":{\"text\":\"{name:'{\\\"text\\\":\\\"flatbot\\\"}',id:\\\"4ac66405-1ba4-36ae-8da7-2ec6cd494ada\\\",type:\\\"minecraft:player\\\"}\"}},\"text\":\"flatbot\"},\"did the recipe for birch_planks 1 times\"]}",
  minecraft-protocol   "position": 0
  minecraft-protocol } +0ms
  minecraft-protocol read packet play.chat +0ms
  minecraft-protocol {
  minecraft-protocol   "message": "{\"translate\":\"chat.type.text\",\"with\":[{\"insertion\":\"flatbot\",\"clickEvent\":{\"action\":\"suggest_command\",\"value\":\"/tell flatbot \"},\"hoverEvent\":{\"action\":\"show_entity\",\"value\":{\"text\":\"{name:'{\\\"text\\\":\\\"flatbot\\\"}',id:\\\"4ac66405-1ba4-36ae-8da7-2ec6cd494ada\\\",type:\\\"minecraft:player\\\"}\"}},\"text\":\"flatbot\"},\"without a crafting table, I can make birch_planks\"]}",
  minecraft-protocol   "position": 0
  minecraft-protocol } +0ms
  minecraft-protocol read packet play.transaction +0ms
  minecraft-protocol {
  minecraft-protocol   "windowId": 0,
  minecraft-protocol   "action": 6,
  minecraft-protocol   "accepted": true
  minecraft-protocol } +1ms
  minecraft-protocol writing packet play.window_click +0ms
  minecraft-protocol {
  minecraft-protocol   windowId: 0,
  minecraft-protocol   slot: 4,
  minecraft-protocol   mouseButton: 1,
  minecraft-protocol   action: 7,
  minecraft-protocol   mode: 0,
  minecraft-protocol   item: { present: false }
  minecraft-protocol } +0ms
  minecraft-protocol read packet play.set_slot +2ms
  minecraft-protocol {
  minecraft-protocol   "windowId": 0,
  minecraft-protocol   "slot": 0,
  minecraft-protocol   "item": {
  minecraft-protocol     "present": true,
  minecraft-protocol     "itemId": 15,
  minecraft-protocol     "itemCount": 4
  minecraft-protocol   }
  minecraft-protocol } +0ms
{ slot: 0, oldItemName: null, newItemName: 'birch_planks' }
  minecraft-protocol read packet play.transaction +0ms
  minecraft-protocol {
  minecraft-protocol   "windowId": 0,
  minecraft-protocol   "action": 7,
  minecraft-protocol   "accepted": true
  minecraft-protocol } +0ms
  minecraft-protocol writing packet play.window_click +1ms
  minecraft-protocol {
  minecraft-protocol   windowId: 0,
  minecraft-protocol   slot: 0,
  minecraft-protocol   mouseButton: 0,
  minecraft-protocol   action: 8,
  minecraft-protocol   mode: 0,
  minecraft-protocol   item: { present: true, itemId: 15, itemCount: 4 }
  minecraft-protocol } +0ms
  minecraft-protocol read packet play.unlock_recipes +0ms
  minecraft-protocol {
  minecraft-protocol   "action": 1,
  minecraft-protocol   "craftingBookOpen": false,
  minecraft-protocol   "filteringCraftable": false,
  minecraft-protocol   "smeltingBookOpen": false,
  minecraft-protocol   "filteringSmeltable": false,
  minecraft-protocol   "recipes1": []
  minecraft-protocol } +0ms
  minecraft-protocol read packet play.set_slot +1ms
  minecraft-protocol {
  minecraft-protocol   "windowId": 0,
  minecraft-protocol   "slot": 0,
  minecraft-protocol   "item": {
  minecraft-protocol     "present": false
  minecraft-protocol   }
  minecraft-protocol } +0ms
{ slot: 0, oldItemName: 'birch_planks', newItemName: null }
  minecraft-protocol read packet play.transaction +1ms
  minecraft-protocol {
  minecraft-protocol   "windowId": 0,
  minecraft-protocol   "action": 8,
  minecraft-protocol   "accepted": true
  minecraft-protocol } +0ms
{
  waitForStackSlot: 10,
  inventory: Window {
    _events: [Object: null prototype] {},
    _eventsCount: 0,
    _maxListeners: undefined,
    id: 0,
    type: 'minecraft:inventory',
    title: 'Inventory',
    slots: [
      null, null, null, null, [Item], null,
      null, null, null, null, [Item], null,
      null, null, null, null, null,   null,
      null, null, null, null, null,   null,
      null, null, null, null, null,   null,
      null, null, null, null, null,   null,
      null, null, null, null, null,   null,
      null, null, null, null
    ],
    inventoryStart: 9,
    inventoryEnd: 45,
    hotbarStart: 36,
    craftingResultSlot: 0,
    requiresConfirmation: true,
    selectedItem: Item {
      type: 15,
      count: 4,
      metadata: 0,
      nbt: null,
      name: 'birch_planks',
      displayName: 'Birch Planks',
      stackSize: 64,
      slot: 0
    },
    [Symbol(kCapture)]: false
  }
}
  minecraft-protocol writing packet play.window_click +1ms
  minecraft-protocol {
  minecraft-protocol   windowId: 0,
  minecraft-protocol   slot: 10,
  minecraft-protocol   mouseButton: 0,
  minecraft-protocol   action: 9,
  minecraft-protocol   mode: 0,
  minecraft-protocol   item: { present: true, itemId: 15, itemCount: 4 }
  minecraft-protocol } +0ms
  minecraft-protocol read packet play.transaction +0ms
  minecraft-protocol {
  minecraft-protocol   "windowId": 0,
  minecraft-protocol   "action": 9,
  minecraft-protocol   "accepted": true
  minecraft-protocol } +0ms
```
