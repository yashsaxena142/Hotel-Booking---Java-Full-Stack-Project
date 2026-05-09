// src/main/java/com/prashant/hotelbookingbackend/controller/HotelController.java
package com.prashant.hotelbookingbackend.controller;

import com.prashant.hotelbookingbackend.dto.HotelDTO;
import com.prashant.hotelbookingbackend.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:3000")
public class HotelController {
    @Autowired
    private HotelService hotelService;
    
    @GetMapping
    public ResponseEntity<List<HotelDTO>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HotelDTO> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<HotelDTO>> searchHotels(@RequestParam String q) {
        return ResponseEntity.ok(hotelService.searchHotels(q));
    }
    
    @GetMapping("/owner")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<List<HotelDTO>> getHotelsByOwner() {
        return ResponseEntity.ok(hotelService.getHotelsByOwner());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<HotelDTO> createHotel(@RequestBody HotelDTO hotelDTO) {
        return ResponseEntity.ok(hotelService.createHotel(hotelDTO));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<HotelDTO> updateHotel(@PathVariable Long id, @RequestBody HotelDTO hotelDTO) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotelDTO));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok().build();
    }
}