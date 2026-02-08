fn main() {
    let condition = true;
    let number = if condition {
        5
    } else {
        "six" // Error: expected integer, found &str
    };

    println!("The value of number is: {}", number);
}

// 👇 Below are the tests - Do not modify 👇

#[cfg(test)]
mod tests {
    #[test]
    fn test_if_else() {
        assert!(true);
    }
}
