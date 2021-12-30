import routes from 'routes';
import FetchHelper from 'utils/fetchHelper';

export default {
  index(params) {
    const path = routes.apiV1TasksPath();
    return FetchHelper.get(path, params);
  },

  show(id) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.get(path);
  },

  update(id, task = {}) {
    const path = routes.apiV1TasksPath();
    return FetchHelper.get(path, params);
  },

  create(task = {}) {
    const path = routes.apiV1TasksPath();
    return FetchHelper.get(path, params);
  },

  destroy(id) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.get(path);
  },
};
