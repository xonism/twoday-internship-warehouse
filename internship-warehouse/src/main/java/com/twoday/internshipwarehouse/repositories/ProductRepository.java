package com.twoday.internshipwarehouse.repositories;

import com.twoday.internshipwarehouse.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Product findById(int id);
}
