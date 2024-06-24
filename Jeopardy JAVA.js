$(document).ready(function() {
    const apiUrl = 'https://rithm-jeopardy.herokuapp.com/api';

    // Function to fetch random categories from API
    async function getRandomCategories(count) {
        try {
            const response = await axios.get(`${apiUrl}/categories?count=${count}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    // Function to fetch random questions for a category
    async function getRandomQuestions(categoryId) {
        try {
            const response = await axios.get(`${apiUrl}/category?id=${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching questions for category ${categoryId}:`, error);
        }
    }

    // Function to initialize the game board
    async function initializeGame() {
        const categoriesCount = 6;
        const questionsPerCategory = 5;

        const categories = await getRandomCategories(categoriesCount);

        // Populate category headers
        const categoriesRow = $('#categories-row');
        categories.forEach(category => {
            categoriesRow.append(`<th>${category.title}</th>`);
        });

        // Fetch and populate questions for each category
        const questionsBody = $('#questions-body');
        categories.forEach(async category => {
            const questions = await getRandomQuestions(category.id);
            questions.slice(0, questionsPerCategory).forEach(question => {
                questionsBody.append(`<tr><td><button class="question-btn" data-question="${question.question}" data-answer="${question.answer}">?</button></td></tr>`);
            });
        });
    }

    // Event listener for question button clicks
    $('#questions-body').on('click', '.question-btn', function() {
        const question = $(this).attr('data-question');
        const answer = $(this).attr('data-answer');
        $(this).text(question).attr('data-question', '').attr('data-answer', answer).addClass('answered');
    });

    // Event listener for modal close button
    $('.modal .close').click(function() {
        $('.modal').hide();
    });

    // Event listener for restart game button
    $('#restart-btn').click(function() {
        $('#categories-row').empty();
        $('#questions-body').empty();
        initializeGame();
    });

    // Initialize the game when the page loads
    initializeGame();
});
