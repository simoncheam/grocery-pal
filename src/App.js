import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

// function to get local storage

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return  JSON.parse(localStorage.getItem('list'));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      showAlert(true, 'danger', 'Please enter a value');
    } else if (name && isEditing) {
      // add to list
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          } // changing the name of the item
          return item; //
        })
      );
      setName('');
      setEditID(null); // resetting the editID
      setIsEditing(false); // reset
      showAlert(true, 'success', 'value updated');
    } else {
      //show alert
      showAlert(true, 'success', 'Item added');
      // create new item
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
    }

    console.log('hello');
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const clearList = () => {
    showAlert(true, 'danger', 'List cleared');
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, 'danger', 'Item removed');
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id); //! useful find method

    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    getLocalStorage()
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]); //! when list changes, update local storage


  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3> Grocery Pal</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );


}

export default App;
