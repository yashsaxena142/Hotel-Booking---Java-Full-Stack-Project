// src/main/java/com/prashant/hotelbookingbackend/controller/BookingController.java
package com.prashant.hotelbookingbackend.controller;

import com.prashant.hotelbookingbackend.dto.BookingDTO;
import com.prashant.hotelbookingbackend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    @Autowired
    private BookingService bookingService;
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('HOTEL_OWNER')")
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO) {
        return ResponseEntity.ok(bookingService.createBooking(bookingDTO));
    }
    
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('HOTEL_OWNER')")
    public ResponseEntity<List<BookingDTO>> getUserBookings() {
        return ResponseEntity.ok(bookingService.getUserBookings());
    }
    
    @GetMapping("/hotel/{hotelId}")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<List<BookingDTO>> getHotelBookings(@PathVariable Long hotelId) {
        return ResponseEntity.ok(bookingService.getHotelBookings(hotelId));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('HOTEL_OWNER')")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}