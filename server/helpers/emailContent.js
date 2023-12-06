const addEmailContent = () => {
    const myContent = `
    <div>
        <h2>LATEST POST</h2>

        <h5>Hi there,</h5>

        <p>A new post have been posted on our site. Click on the link below to find out what's in the latest post:</p>
        <a href="${process.env.APP_SERVER}">${process.env.APP_SERVER}</a>

        <p>Best,</p>

        <p>The Citizen Reporting Team</p>
    </div>
    `;

    return (myContent);
};

module.exports = addEmailContent;
