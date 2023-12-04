const addEmailContent = () => {
    const myContent = `
    <h2>LATEST POST</h2>
    <p>A new incident have been posted to our site, Check out what it is right 
        <a href="http://${process.env.APP_SERVER}">here</a>
    </p>
    `;

    return (myContent);
};

module.exports = addEmailContent;
