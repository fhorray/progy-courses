# If/Else Expressions

In Rust, `if` is an **expression**, meaning it returns a value. This allows you to use `if` on the right side of a `let` statement.

::video[https://www.youtube.com/watch?v=wXjkL-X_hQI]

## Syntax

```rust
let number = if condition { 5 } else { 6 };
```

::note[Both arms of the `if` expression must return the same type!]

## Your Task

The code below tries to assign a value to `result`, but the types in the `if` and `else` blocks don't match. 
Fix it so both return an integer.
