# Mutability in Rust

In Rust, variables are **immutable** by default. This means once a value is bound to a name, you can't change that value. To make a variable mutable, you must add `mut` in front of the variable name.

::video[https://www.youtube.com/watch?v=zF34dRivLOw]

## Ex 1: Making it Mutable

The code below tries to assign a new value to `x`, but it fails to compile because `x` is not mutable.

::note[Error: cannot assign twice to immutable variable `x`]

**Your Task:**
Fix the code by adding `mut` to the declaration of `x`.
