// Client-Side (Browser) JavaScript
function getTimeDiff(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = Math.abs(currentDate - createdDate);
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    if (secondsDifference < 60) {
        return (`${secondsDifference} ${secondsDifference === 1 ? 'second' : 'seconds'} ago`);
    } else if (minutesDifference < 60) {
        return (`${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`);
    } else if (hoursDifference < 24) {
        return (`${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`);
    } else {
        return (`${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago`);
    }
}

export default getTimeDiff;
