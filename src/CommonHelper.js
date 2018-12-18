const getEventTargetValue = (ev) => ev.target.value;
const toJson = (response) => response.json();

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const getToken = () => {
  console.log(localStorage.getItem('token'));
  return localStorage.getItem('token');
};

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const fetchHelper = (url, options) => {
  options.headers = {
    'Content-Type': 'application/json'
  };
  options.headers.authorization = getToken();
  return fetch(url,options);
}

const setLoading = (isLoading, that) => {
  that.setState({ isLoading: isLoading });
}

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export { 
  getEventTargetValue, 
  toJson, 
  handleErrors,
  getToken,
  setToken,
  fetchHelper,
  setLoading,
  sleep
};