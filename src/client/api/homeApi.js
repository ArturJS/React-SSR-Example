import baseApi from './baseApi';

export const homeApi = {
  getPackages() {
    return baseApi.ajax({
      method: 'get',
      url: '/packages'
    })
      .then(res => res.data)
      .then(data => {
        return data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description
        }));
      });
  }
};
