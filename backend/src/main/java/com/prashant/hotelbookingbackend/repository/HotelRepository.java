// src/main/java/com/prashant/hotelbookingbackend/repository/HotelRepository.java
package com.prashant.hotelbookingbackend.repository;

import com.prashant.hotelbookingbackend.entity.Hotel;
import com.prashant.hotelbookingbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByOwner(User owner);
    
    @Query("SELECT h FROM Hotel h WHERE " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(h.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(h.address) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Hotel> searchHotels(@Param("searchTerm") String searchTerm);
    
    List<Hotel> findByLocationContainingIgnoreCase(String location);
    
    @Query("SELECT h FROM Hotel h WHERE h.rating >= :minRating")
    List<Hotel> findTopRatedHotels(@Param("minRating") Double minRating);
}