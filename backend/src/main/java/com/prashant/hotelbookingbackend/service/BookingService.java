// src/main/java/com/prashant/hotelbookingbackend/service/BookingService.java
package com.prashant.hotelbookingbackend.service;

import com.prashant.hotelbookingbackend.dto.BookingDTO;
import com.prashant.hotelbookingbackend.entity.Booking;
import com.prashant.hotelbookingbackend.entity.Hotel;
import com.prashant.hotelbookingbackend.entity.User;
import com.prashant.hotelbookingbackend.repository.BookingRepository;
import com.prashant.hotelbookingbackend.repository.HotelRepository;
import com.prashant.hotelbookingbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public BookingDTO createBooking(BookingDTO bookingDTO) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Hotel hotel = hotelRepository.findById(bookingDTO.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        
        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                hotel.getId(), bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        
        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Hotel is not available for the selected dates");
        }
        
        // Calculate total price
        long nights = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        Double totalPrice = hotel.getPricePerNight() * nights * bookingDTO.getNumberOfRooms();
        
        Booking booking = new Booking();
        booking.setCheckInDate(bookingDTO.getCheckInDate());
        booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        booking.setNumberOfGuests(bookingDTO.getNumberOfGuests());
        booking.setNumberOfRooms(bookingDTO.getNumberOfRooms());
        booking.setTotalPrice(totalPrice);
        booking.setStatus("CONFIRMED");
        booking.setBookingDate(LocalDateTime.now());
        booking.setUser(user);
        booking.setHotel(hotel);
        
        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }
    
    public BookingDTO cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to cancel this booking");
        }
        
        booking.setStatus("CANCELLED");
        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }
    
    public List<BookingDTO> getUserBookings() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return bookingRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookingDTO> getHotelBookings(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        
        return bookingRepository.findByHotel(hotel).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDTO(booking);
    }
    
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setNumberOfGuests(booking.getNumberOfGuests());
        dto.setNumberOfRooms(booking.getNumberOfRooms());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setBookingDate(booking.getBookingDate());
        
        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            dto.setUserName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
        }
        
        if (booking.getHotel() != null) {
            dto.setHotelId(booking.getHotel().getId());
            dto.setHotelName(booking.getHotel().getName());
            dto.setHotelLocation(booking.getHotel().getLocation());
        }
        
        return dto;
    }
}