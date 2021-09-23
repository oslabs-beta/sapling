import Base from './Base';

export default class ActivationsAPI extends Base {
    list(params) {
        return this.apiClient.get('quizwall/activations', {}, params);
    }

    show(id, params) {
        return this.apiClient.get(`quizwall/activations/${id}`, {}, params);
    }
}
