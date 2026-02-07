# Loops

Rust provides three kinds of loops:
1. `loop`: Infinite loop.
2. `while`: Loop while a condition is true.
3. `for`: Loop over a collection.

::video[https://www.youtube.com/watch?v=5BrZ5aZ7P5M]

## `loop` Example

```rust
loop {
    println!("again!");
    break; // Exit the loop
}
```

## Your Task

The code below uses `loop` but doesn't have a `break` condition inside to stop it when `counter` reaches 10.
Add a `break` statement inside the `if` block.
