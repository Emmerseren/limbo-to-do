

const saveToLocalStorage = (value) => {
    localStorage.setItem('todos', JSON.stringify(value));
  };

  export default saveToLocalStorage