local list_utils = {}

function list_utils.sort_by_key(list, key, descending)
    table.sort(list, function(a, b)
        if descending then
            return a[key] > b[key]
        else
            return a[key] < b[key]
        end
    end)
    return list
end

function list_utils.paginate(list, cursor, limit)
    local current_page = cursor and tonumber(cursor) or 1
    local start_index = (current_page - 1) * limit + 1
    local end_index = math.min(start_index + limit, #list)
    local paginated_list = {}
    for i = start_index, end_index do
        table.insert(paginated_list, list[i])
    end
    local next_cursor = end_index < #list and (current_page + 1) or -1
    return paginated_list, next_cursor
end

return list_utils
