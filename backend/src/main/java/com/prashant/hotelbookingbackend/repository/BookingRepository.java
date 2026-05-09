// src/main/java/com/prashant/hotelbookingbackend/repository/BookingRepository.java
package com.prashant.hotelbookingbackend.repository;

import com.prashant.hotelbookingbackend.entity.Booking;
import com.prashant.hotelbookingbackend.entity.User;
import com.prashant.hotelbookingbackend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByHotel(Hotel hotel);
    
    @Query("SELECT b FROM Booking b WHERE b.hotel.id = :hotelId AND " +
           "b.status = 'CONFIRMED' AND " +
           "((b.checkInDate BETWEEN :checkIn AND :checkOut) OR " +
           "(b.checkOutDate BETWEEN :checkIn AND :checkOut) OR " +
           "(:checkIn BETWEEN b.checkInDate AND b.checkOutDate))")
    List<Booking> findConflictingBookings(
        @Param("hotelId") Long hotelId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
    
    List<Booking> findByUserAndStatus(User user, String status);
}