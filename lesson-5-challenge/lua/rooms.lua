local json = require("json")
local list_utils = require("list_utils")

local SUPERUSER_ID = "LBLj0rux7hvHz5jILVuhszpM6aSDEQdtvN0SdMtVmgg"

Rooms = Rooms or {}

Handlers.add(
    'GetRooms',
    Handlers.utils.hasMatchingTag('Action', 'GetRooms'),
    function(msg)
        local roomsList = {}
        for _, room in pairs(Rooms) do
            table.insert(roomsList, room)
        end
        local sorted_rooms = list_utils.sort_by_key(roomsList, 'timestamp', false)
        Handlers.utils.reply(json.encode(sorted_rooms))(msg)
    end
)

Handlers.add(
    'CreateRoom',
    Handlers.utils.hasMatchingTag('Action', 'CreateRoom'),
    function(msg)
        local data = json.decode(msg.Data)
        Rooms[data.id] = {
            id = data.id,
            admin = {SUPERUSER_ID, data.admin},
            name = data.name,
            timestamp = data.timestamp,
            online = {}
        }
        Handlers.utils.reply('Room created')(msg)
    end
)

Handlers.add(
    'DeleteRoom',
    Handlers.utils.hasMatchingTag('Action', 'DeleteRoom'),
    function(msg)
        local data = json.decode(msg.Data)
        if Rooms[data.id] and Rooms[data.id].admin and (data.owner == SUPERUSER_ID or table.concat(Rooms[data.id].admin):find(data.owner)) then
            Rooms[data.id] = nil
            Handlers.utils.reply('Room deleted')(msg)
        else
            Handlers.utils.reply('Room not found or unauthorized')(msg)
        end
    end
)

Handlers.add(
    'AddOnlineUser',
    Handlers.utils.hasMatchingTag('Action', 'AddOnlineUser'),
    function(msg)
        local data = json.decode(msg.Data)
        if Rooms[data.id] then
            table.insert(Rooms[data.id].online, data.user)
            Handlers.utils.reply('User added online')(msg)
        else
            Handlers.utils.reply('Room not found')(msg)
        end
    end
)

Handlers.add(
    'RemoveOnlineUser',
    Handlers.utils.hasMatchingTag('Action', 'RemoveOnlineUser'),
    function(msg)
        local data = json.decode(msg.Data)
        if Rooms[data.id] then
            for i, online_user in ipairs(Rooms[data.id].online) do
                if online_user == data.user then
                    table.remove(Rooms[data.id].online, i)
                    Handlers.utils.reply('User removed online')(msg)
                    return
                end
            end
            Handlers.utils.reply('User not found in online list')(msg)
        else
            Handlers.utils.reply('Room not found')(msg)
        end
    end
)
