fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            // TODO: Add a break statement that returns the value of counter * 2
            counter * 2 // This is just an expression, it doesn't break the loop
        }
    };

    println!("The result is {}", result);
}

// 👇 Below are the tests - Do not modify 👇

#[cfg(test)]
mod tests {
    #[test]
    fn test_loops() {
        assert!(true);
    }
}
