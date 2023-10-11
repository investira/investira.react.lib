function mockRequest(pData, pOptions = { status: 200 }, pWait = 200) {
    const xResponse = new Response(JSON.stringify(pData), pOptions);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            pOptions.status >= 400 ? reject(xResponse) : resolve(xResponse);
        }, pWait);
    });
}

export default mockRequest;
