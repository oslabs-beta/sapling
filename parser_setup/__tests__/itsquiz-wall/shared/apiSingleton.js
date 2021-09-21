import config     from './config';
import apiFactory from './api';

export default apiFactory({
    apiPrefix: config.apiPrefix
});
