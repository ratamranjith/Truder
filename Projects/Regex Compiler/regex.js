// Simple method to compile the regex pattern
function compileRegex() {
    const regexPattern = document.getElementById('regex-input').value;
    const testText = document.getElementById('test-text').value;

    try {
        const regex = new RegExp(regexPattern);
        const result = regex.test(testText);

        /* Use Ternary operator to match the pattern */
        document.getElementById('result').innerHTML = result
            ? '<span style="color: green;">Match!</span>'
            : '<span style="color: red;">No match!</span>';
    } catch (error) {
        document.getElementById('result').innerHTML = '<span style="color: red;">Invalid regex pattern!</span>';
    }
}
