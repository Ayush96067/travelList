import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }
  function onHandleDelete(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function onHandleToggle(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleDeleteAll() {
    const confirm = window.confirm("Are you sure to clear the list");
    if (confirm) setItems([]);
  }

  return (
    <>
      <div className="background">
        <Navbar />
        <Form AddItems={handleAddItems} />
        <Section
          items={items}
          deleteItem={onHandleDelete}
          onToggleItem={onHandleToggle}
          deleteALl={handleDeleteAll}
        />
        <Stats items={items} />
      </div>
    </>
  );
}

function Navbar() {
  return (
    <div className="navbar">
      <h1>TRAVEL LIST</h1>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/">About</a>
        </li>
        <li>
          <a href="/">Contact us</a>
        </li>
      </ul>
    </div>
  );
}

function Form({ AddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log(newItem);
    AddItems(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Your Travel List</h2>
      <div className="form">
        <h3>What do you need for your trip</h3>
        <select
          value={quantity}
          onChange={(val) => setQuantity(val.target.value)}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={description}
          placeholder="Enter Item....... "
          onChange={(val) => setDescription(val.target.value)}
        />
        <button>Add</button>
      </div>
    </form>
  );
}

function Section({ items, deleteItem, onToggleItem, deleteALl }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;
  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed") {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }
  return (
    <div className="container-section">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            deleteItem={deleteItem}
            key={item.id}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description order</option>
          <option value="packed">Sort by packed order</option>
        </select>
        <button onClick={deleteALl}>Clear</button>
      </div>
    </div>
  );
}

function Item({ item, deleteItem, onToggleItem }) {
  return (
    <li key={item.id}>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => deleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>
          Start adding the items by providing quantity and these Description
        </em>
      </p>
    );

  const numItems = items.length;
  const packedItem = items.filter((item) => item.packed).length;
  const perc = Math.round((packedItem / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {perc === 100
          ? "Ready to go"
          : `You have ${numItems} items on your list, and you already packed ${packedItem} (${perc}%)`}
      </em>
    </footer>
  );
}
