fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(s1); // TODO: Pass a reference to s1

    println!("The length of '{}' is {}.", s1, len); // Error: s1 is moved!
}

fn calculate_length(s: String) -> usize { // TODO: Change to take &String
    s.len()
}

// 👇 Below are the tests - Do not modify 👇

#[cfg(test)]
mod tests {
    #[test]
    fn test_borrowing() {
        assert!(true);
    }
}
