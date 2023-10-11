function mockURLRequest(data) {
    const xJson = JSON.stringify(data);
    const xBlob = new Blob([xJson], { type: 'application/json' });

    return URL.createObjectURL(xBlob);
}

export default mockURLRequest;
