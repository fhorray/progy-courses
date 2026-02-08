fn main() {
    let s1 = String::from("hello");
    let s2 = s1;

    println!("s1 = {}, s2 = {}", s1, s2);
}

// 👇 Below are the tests - Do not modify 👇

#[cfg(test)]
mod tests {
    #[test]
    fn test_move() {
        assert!(true);
    }
}
