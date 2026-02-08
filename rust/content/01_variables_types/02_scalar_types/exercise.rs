fn main() {
    let price = 9.99; // TODO: Explicitly annotate as f64
    let is_available = true; // TODO: Explicitly annotate as bool
    let initial = 'R'; // Rust infers this, which is fine, but focus on the others.

    // Actually, to make it fail if types are missing, usually we need a scenario where inference fails.
    // Or we just check if they added the type annotation (which is hard to check with just running).
    // Let's make a scenario where type inference needs help or we rely on the user to just modify it.
    
    // Better idea: Assign a float to an integer type variable to cause a mismatch?
    // "Fix the type mismatch"
    
    let quantity: u32 = 5.5; // Error here!
    
    println!("Quantity: {}", quantity);
}

// 👇 Below are the tests - Do not modify 👇

#[cfg(test)]
mod tests {
    #[test]
    fn test_types() {
        assert!(true);
    }
}
