import { useState } from "react"

export function NewTodoForm(props) {
    props.addTodo
    const [newItem, setNewItem] = useState("")

    function handleSubmit(event) {
        event.preventDefault()
        if (newItem === "") return

        props.addTodo(newItem)
    
        setNewItem("")
    }

    return (
        <form className="new-item-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" id="item" />
        </div>
        <button className="btn">Add</button>
      </form>
    )
}