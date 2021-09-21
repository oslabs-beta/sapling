import Base from './Base';

export default class AccountsAPI extends Base {
    list(params) {
        return this.apiClient.get('quizwall/accounts', {}, params);
    }

    show(id, params) {
        return this.apiClient.get(`quizwall/accounts/${id}`, {}, params);
    }
}
