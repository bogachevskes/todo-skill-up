export const injectScript = function (scriptName: string) {
    const script = document.createElement('script');
    
    script.src = scriptName;
    
    document.body.appendChild(script);
};

export const getRandomInt = function (max: number) {
    return Math.floor(Math.random() * Math.floor(max));
};