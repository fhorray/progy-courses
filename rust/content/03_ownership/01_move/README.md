# Move Semantics

Ownership is Rust's most unique feature. It enables memory safety without a garbage collector.

## The Rule
When you assign a value (that is not `Copy`) to another variable, the ownership is moved. The original variable is no longer valid.

::video[https://www.youtube.com/watch?v=s19G6dM5b8g]

## `String` Example

```rust
let s1 = String::from("hello");
let s2 = s1; // s1 is moved to s2
println!("{}", s1); // Error! s1 is invalid
```

::note[Types like integers, bools, and chars implement the `Copy` trait, so they are copied instead of moved.]

## Your Task
The code below attempts to use `s1` after it has been moved to `s2`. 
Fix the code by cloning `s1` instead of moving it: `s1.clone()`.
