local json = require("json")
local list_utils = require("list_utils")

local SUPERUSER_ID = "LBLj0rux7hvHz5jILVuhszpM6aSDEQdtvN0SdMtVmgg"

Chats = Chats or {}

local function getRoomChats(roomId)
    return Chats[roomId] or {}
end

Handlers.add(
    'GetRoomChats',
    Handlers.utils.hasMatchingTag('Action', 'GetRoomChats'),
    function(msg)
        local data = json.decode(msg.Data)
        local roomId = data.roomId

        local chatsList = getRoomChats(roomId)
        Handlers.utils.reply(json.encode(chatsList))(msg)
    end
)

Handlers.add(
    'SendChat',
    Handlers.utils.hasMatchingTag('Action', 'SendChat'),
    function(msg)
        local data = json.decode(msg.Data)
        local roomId = data.roomId
        local chatId = data.id

        Chats[roomId] = Chats[roomId] or {}
        Chats[roomId][chatId] = data

        Handlers.utils.reply('Saved')(msg)
    end
)

Handlers.add(
    'DeleteChat',
    Handlers.utils.hasMatchingTag('Action', 'DeleteChat'),
    function(msg)
        local data = json.decode(msg.Data)
        local roomId = data.roomId
        local chatId = data.id
        local owner = data.owner

        if Chats[roomId] and Chats[roomId][chatId] and (Chats[roomId][chatId].owner == owner or owner == SUPERUSER_ID) then
            Chats[roomId][chatId] = nil
            Handlers.utils.reply('Deleted')(msg)
        else
            Handlers.utils.reply('Message not found')(msg)
        end
    end
)

Handlers.add(
    'GetChats',
    Handlers.utils.hasMatchingTag('Action', 'GetChats'),
    function(msg)
        local data = json.decode(msg.Data)
        local roomId = data.roomId
        local cursor = data.cursor
        local limit = data.limit or 10

				print(data)

        local roomChats = getRoomChats(roomId)
        local chatList = {}
        for _, chat in pairs(roomChats) do
            table.insert(chatList, chat)
        end

        local sortedMessages = list_utils.sort_by_key(chatList, 'timestamp', true)
        local paginatedMessages, nextCursor = list_utils.paginate(sortedMessages, cursor, limit)

        local response = {
            data = paginatedMessages,
            nextCursor = nextCursor
        }

        Handlers.utils.reply(json.encode(response))(msg)
    end
)
