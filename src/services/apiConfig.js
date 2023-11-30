// apiConfig.js

const apiConfig ={
    header: {
        app_id: 'fa60865b', 
        uid: '111'    
    },
    parameter: {
        chat: {
            domain: 'generalv3',
            temperature: 0.5,
            max_tokens: 1024,
        }
    },
    payload: {
        message: {
            text: []  // 在调用时动态填充这部分内容
        }
    }
}
module.exports = {
    apiConfig
};