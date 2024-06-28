local json = require("json")
local animals = require("animals")
local ph = require('ph')

GAME_CATEGORY = {
	ANIMALS = 'Guess the animal',
	PH = 'PH Trivias'
}

GAME_STATE = {
	LOBBY = 'lobby',
	PLAYING = 'playing',
	RESULT = 'result',
}

Users = {}
Games = {}

-- Upsert User Handler
Handlers.add(
    'UpsertUser',
    Handlers.utils.hasMatchingTag('Action', 'UpsertUser'),
    function(msg)
				local data = json.decode(msg.Data)
				Users[data.wallet] = {
					name = data.name,
				}
				local response = json.encode({ success = true, message = "OK" })
        Handlers.utils.reply(response)(msg)
    end
)

-- Get User Handler
Handlers.add(
    'GetUser',
    Handlers.utils.hasMatchingTag('Action', 'GetUser'),
    function(msg)
        local data = json.decode(msg.Data)
        local wallet = data.wallet

        if not Users[wallet] then
            local response = json.encode({
                success = false,
                message = "User not found",
                data = nil
            })
            Handlers.utils.reply(response)(msg)
            return
        end

        local user = Users[wallet]
        local response = json.encode({
            success = true,
            message = "User retrieved",
            data = { wallet = wallet, name = user.name}
        })
        Handlers.utils.reply(response)(msg)
    end
)

local animalQuestionKeys = {}
for key in pairs(animals.questions) do
    table.insert(animalQuestionKeys, key)
end

local phQuestionKeys = {}
for key in pairs(ph.questions) do
    table.insert(phQuestionKeys, key)
end

local function getRandomQuestions(category)
    local questionKeys

    if category == GAME_CATEGORY.ANIMALS then
        questionKeys = animalQuestionKeys
    elseif category == GAME_CATEGORY.PH then
        questionKeys = phQuestionKeys
    else
        return nil, "Invalid category"
    end

    local randomQuestions = {}
    local keysCopy = {table.unpack(questionKeys)} -- Create a copy to avoid modifying the original

    for i = 1, 10 do
        local randomIndex = math.random(1, #keysCopy)
        local questionId = table.remove(keysCopy, randomIndex)
        table.insert(randomQuestions, questionId)
    end

    return randomQuestions
end

local function transformGameToData(gameId)
    local game = Games[gameId]
    if not game then
        return nil, "Game not found"
    end

    local data = {
        id = gameId,
        category = game.category,
        timeLimit = game.timeLimit,
        timeCreated = game.timeCreated,
        timeStarted = game.timeStarted,
        timeEnded = game.timeEnded,
        state = game.state,
				currentQuestionIndex = game.currentQuestionIndex - 1, -- lua index starts at 1
        currentQuestion = game.currentQuestion,
        host = game.host,
        players = game.players
    }

		if game.state == GAME_STATE.RESULT and game.currentQuestion then
        local questionId = game.currentQuestion.id
        local answer
        if game.category == GAME_CATEGORY.ANIMALS then
            answer = animals.questions[questionId].answer
        elseif game.category == GAME_CATEGORY.PH then
            answer = ph.questions[questionId].answer
        end
        data.currentAnswer = answer
    end

		if game.state == GAME_STATE.RESULT or game.timeEnded then
        data.answers = game.answers
    end

		return data
end

-- Create Game Handler
Handlers.add(
    'CreateGame',
    Handlers.utils.hasMatchingTag('Action', 'CreateGame'),
    function(msg)
				local data = json.decode(msg.Data)
				local questions, err = getRandomQuestions(data.category)

				if not questions then
            local response = json.encode({ success = false, message = err })
            Handlers.utils.reply(response)(msg)
            return
        end

				local gameId = data.id

        Games[gameId] = {
            category = data.category,
            host = data.host,
            timeLimit = data.timeLimit,
            timeCreated = data.timeCreated,
            timeStarted = nil,
            timeEnded = nil,
            state = GAME_STATE.LOBBY,
            currentQuestionIndex = 1,
						currentQuestion = nil,
            questions = questions,
            players = {},
            answers = {}
        }

        local response = json.encode({
            success = true,
            message = "Game Created",
            data = transformGameToData(gameId)
        })
        Handlers.utils.reply(response)(msg)
    end
)

-- Get Game By ID Handler
Handlers.add(
    'GetGameById',
    Handlers.utils.hasMatchingTag('Action', 'GetGameById'),
    function(msg)
        local data = json.decode(msg.Data)
        local gameId = data.gameId

        local gameData, err = transformGameToData(gameId)
        if not gameData then
            local response = json.encode({ success = false, message = err })
            Handlers.utils.reply(response)(msg)
            return
        end
        
        local response = json.encode({
            success = true,
            message = "Game retrieved",
            data = gameData
        })
        Handlers.utils.reply(response)(msg)
    end
)

-- Next Question Handler
Handlers.add(
    'NextQuestion',
    Handlers.utils.hasMatchingTag('Action', 'NextQuestion'),
    function(msg)
        local data = json.decode(msg.Data)
				local gameId = data.gameId
				local timestamp = data.timestamp

				if not Games[gameId] then
            local response = json.encode({
                success = false,
                message = "Game not found",
                data = nil
            })
            Handlers.utils.reply(response)(msg)
            return
        end

        local currentQuestionIndex = Games[gameId].currentQuestionIndex
				local response

        if currentQuestionIndex > 10 then
            response = {
                success = true,
                message = "No more questions",
                data = nil
            }
            Games[gameId].state = GAME_STATE.LOBBY
						Games[gameId].timeEnded = timestamp
						Games[gameId].currentQuestion = nil
						Games[gameId].currentAnswer = nil
						Handlers.utils.reply(json.encode(response))(msg)
						return
				end

				local questionId = Games[gameId].questions[currentQuestionIndex]
				local questionData

				if Games[gameId].category == GAME_CATEGORY.ANIMALS then
						questionData = animals.questions[questionId]
				elseif Games[gameId].category == GAME_CATEGORY.PH then
						questionData = ph.questions[questionId]
				else
						response = {
								success = false,
								message = "Invalid category",
								data = nil
						}
						Handlers.utils.reply(json.encode(response))(msg)
						return
				end

				-- Ensure we have exactly 4 choices including the correct answer
				local choices = {}
				local answer = questionData.answer
				local answerIncluded = false

				for i, choice in ipairs(questionData.choices) do
						if #choices < 4 then
								table.insert(choices, choice)
								if choice == answer then
										answerIncluded = true
								end
						end
				end

				-- If the answer wasn't included, replace the last choice with the answer
				if not answerIncluded then
						choices[4] = answer
				end

				local currentQuestion = {
						id = questionId,
						question = questionData.question,
						choices = choices,
						image = questionData.image
				}

				-- Update the current question index
				Games[gameId].currentQuestionIndex = currentQuestionIndex + 1

        -- Update timeStarted if not yet set
        if not Games[gameId].timeStarted then
            Games[gameId].timeStarted = timestamp
        end

        -- Update game status if it's 'lobby'
        if Games[gameId].state ~= GAME_STATE.PLAYING then
            Games[gameId].state = GAME_STATE.PLAYING
        end

				-- Update game currentQuestion
				Games[gameId].currentQuestion = currentQuestion

				response = {
						success = true,
						message = 'Next question retrieved',
						data = currentQuestion
				}

        local jsonResponse = json.encode(response)
        Handlers.utils.reply(jsonResponse)(msg)
    end
)

-- Function to validate if a given state is valid
local function isValidState(state)
    for _, validState in pairs(GAME_STATE) do
        if state == validState then
            return true
        end
    end
    return false
end

-- Generic Update Game State Handler
Handlers.add(
    'UpdateGameState',
    Handlers.utils.hasMatchingTag('Action', 'UpdateGameState'),
    function(msg)
        local data = json.decode(msg.Data)
        local gameId = data.gameId
        local newState = data.state

        if not Games[gameId] then
            local response = json.encode({
                success = false,
                message = "Game not found",
            })
            Handlers.utils.reply(response)(msg)
            return
        end

        if not isValidState(newState) then
            local response = json.encode({
                success = false,
                message = "Invalid game state",
            })
            Handlers.utils.reply(response)(msg)
            return
        end

        Games[gameId].state = newState

        local response = json.encode({
            success = true,
            message = "Game state updated",
        })
        Handlers.utils.reply(response)(msg)
    end
)

-- Add Player Handler
Handlers.add(
    'AddPlayer',
    Handlers.utils.hasMatchingTag('Action', 'AddPlayer'),
    function(msg)
        local data = json.decode(msg.Data)
        local gameId = data.gameId
        local wallet = data.wallet

        -- Check if the game exists
        if not Games[gameId] then
            local response = json.encode({
                success = false,
                message = "Game not found",
            })
            Handlers.utils.reply(response)(msg)
            return
        end

        -- Check if the user exists
        if not Users[wallet] then
            local response = json.encode({
                success = false,
                message = "User not found",
            })
            Handlers.utils.reply(response)(msg)
            return
        end

				-- Check if the user is already in the game's players
        for _, player in ipairs(Games[gameId].players) do
            if player.wallet == wallet then
                -- Player already exists, no operation needed
                local response = json.encode({
                    success = true,
                    message = "Player already in the game",
                })
                Handlers.utils.reply(response)(msg)
                return
            end
        end

        -- Add the user to the game's players
        table.insert(Games[gameId].players, {wallet = wallet, name = Users[wallet].name})

        local response = json.encode({
            success = true,
            message = "Player added",
        })
        Handlers.utils.reply(response)(msg)
    end
)

local function getScoreFromElapsedTime(elapsedTime)
    local maxScore = 2000
    local decayRate = 0.3 -- Adjust the decay rate to control the steepness
    local timeDiff = elapsedTime / 1000 -- convert elapsed time from milliseconds to seconds

    -- Ensure the time difference does not exceed 10 seconds
    if timeDiff >= 10 then
        return 0 -- Score should be 0 after 10 seconds
    end

    -- Calculate the score using an exponential decay function
    local score = maxScore * math.exp(-decayRate * timeDiff)

    -- Ensure the score is at least 1 and round down to a whole number
    score = math.max(math.floor(score), 1)

    return score
end


-- Submit Answer Handler
Handlers.add(
    'SubmitAnswer',
    Handlers.utils.hasMatchingTag('Action', 'SubmitAnswer'),
    function(msg)
        local data = json.decode(msg.Data)
        local gameId = data.gameId
        local wallet = data.wallet
        local questionId = data.questionId
        local selectedAnswer = data.selectedAnswer
        local elapsedTime = data.elapsedTime

        local game = Games[gameId]
        if not game then
            local response = json.encode({ success = false, message = "Game not found" })
            Handlers.utils.reply(response)(msg)
            return
        end

        if not Users[wallet] then
            local response = json.encode({ success = false, message = "User not found" })
            Handlers.utils.reply(response)(msg)
            return
        end

        local questionData
        if game.category == GAME_CATEGORY.ANIMALS then
            questionData = animals.questions[questionId]
        elseif game.category == GAME_CATEGORY.PH then
            questionData = ph.questions[questionId]
        else
            local response = json.encode({ success = false, message = "Invalid category" })
            Handlers.utils.reply(response)(msg)
            return
        end

        local answer = questionData.answer
        local score = selectedAnswer == answer and getScoreFromElapsedTime(elapsedTime) or 0

        table.insert(Games[gameId].answers, {
            user = {
							wallet = wallet,
							name = Users[wallet].name,
						},
            questionId = questionId,
            selected = selectedAnswer,
            score = score
        })

        local response = json.encode({ success = true, message = "Answer submitted", data = score })
        Handlers.utils.reply(response)(msg)
    end
)

-- Get All Game IDs Handler
Handlers.add(
    'GetAllGameIds',
    Handlers.utils.hasMatchingTag('Action', 'GetAllGameIds'),
    function(msg)
        local gameInfos = {}

        for gameId, gameData in pairs(Games) do
            table.insert(gameInfos, { 
                gameId = gameId,
                state = gameData.state,
                timeCreated = gameData.timeCreated,
								timeStarted = gameData.timeStarted,
								timeEnded = gameData.timeEnded,
            })
        end

        local response = json.encode({
            success = true,
            message = "Game IDs, created times, and statuses retrieved",
            data = gameInfos
        })
        Handlers.utils.reply(response)(msg)
    end
)