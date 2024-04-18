async function login(data) {
    const url = 'http://localhost:3000/api/login';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    
    try {
      let response = await fetch(url, requestOptions);
      let json = await response.json();
    
      if (response.success) {
        commit('setUsername', data.username)
        commit('setAuthorized', true)
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      throw error;
    }
}

module.exports = login