import React, { useState, useEffect } from "react";

const fetchItems = (method = "GET", body?: any) => {
  return fetch("http://localhost:4567/items.json", {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => res.json());
};

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todoItem, setTodoItem] = useState("");

  useEffect(() => {
    fetchItems().then(items => {
      setItems(items);
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">
          <img src={require("./logo.svg")} className="App-logo" alt="logo" />
          Todo List
        </span>
      </nav>

      <div className="px-3 py-2">
        <form
          className="form-inline my-3"
          onSubmit={e => {
            e.preventDefault();
            fetchItems("POST", {
              item: todoItem,
            }).then(items => setItems(items));
            setTodoItem("");
          }}
        >
          <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
            <input
              className="form-control col-12"
              placeholder="What do you need to do?"
              value={todoItem}
              onChange={e => setTodoItem(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mb-2 col-4 col-sm-2">
            Add
          </button>
        </form>

        {loading && <p>Loading...</p>}

        {!loading && items.length === 0 && (
          <div className="alert alert-secondary">No items - all done!</div>
        )}

        {!loading && items && (
          <table className="table table-striped">
            <tbody>
              {items.map((item: any, i) => {
                return (
                  <tr key={item.id} className="row">
                    <td className="col-1">{i + 1}</td>
                    <td className="col-10">{item.item}</td>
                    <td className="col-1">
                      <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={e => {
                          e.preventDefault();
                          fetchItems("DELETE", {
                            id: item.id,
                          }).then(items => setItems(items));
                        }}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
