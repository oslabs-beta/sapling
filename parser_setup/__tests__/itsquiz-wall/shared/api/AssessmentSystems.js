import Base from './Base';

export default class AssessmentSystemsAPI extends Base {
    show(id, params) {
        return this.apiClient.get(`quizwall/assessmentsystems/${id}`, {}, params);
    }
}
