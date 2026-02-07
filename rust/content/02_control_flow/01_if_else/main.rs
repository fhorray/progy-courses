fn main() {
    let condition = true;
    let number = if condition {
        5
    } else {
        "six" // Error: expected integer, found &str
    };

    println!("The value of number is: {}", number);
}
