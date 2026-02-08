fn main() {
    let x = 5;
    println!("The value of x is: {}", x);
    x = 6;
    println!("The value of x is: {}", x);
}

// 👇 Below are the tests - Do not modify 👇

#[cfg(test)]
mod tests {
    #[test]
    fn test_mutability() {
        // This test just checks if it compiles, which the runner handles.
        // But let's add a dummy test.
        assert_eq!(2 + 2, 4);
    }
}
