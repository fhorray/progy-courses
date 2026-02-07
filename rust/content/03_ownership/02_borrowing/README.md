# Borrowing

Instead of taking ownership, you can **borrow** a value using references.

- `&T`: Immutable reference (read-only)
- `&mut T`: Mutable reference (read-write)

::video[https://www.youtube.com/watch?v=8M0QfLovvqw]

## The Rules
1. At any given time, you can have either one mutable reference or any number of immutable references.
2. References must always be valid.

## Your Task

The function `calculate_length` takes ownership of the string, which means we can't use `s1` afterwards.
Change the function signature and the call site to take a reference (`&String`) instead of taking ownership.
