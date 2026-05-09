// src/main/java/com/prashant/hotelbookingbackend/service/HotelService.java
package com.prashant.hotelbookingbackend.service;

import com.prashant.hotelbookingbackend.dto.HotelDTO;
import com.prashant.hotelbookingbackend.entity.Hotel;
import com.prashant.hotelbookingbackend.entity.User;
import com.prashant.hotelbookingbackend.repository.HotelRepository;
import com.prashant.hotelbookingbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {
    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<HotelDTO> getAllHotels() {
        return hotelRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public HotelDTO getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        return convertToDTO(hotel);
    }
    
    public HotelDTO createHotel(HotelDTO hotelDTO) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User owner = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!owner.getRole().equals("HOTEL_OWNER")) {
            throw new RuntimeException("Only hotel owners can create hotels");
        }
        
        Hotel hotel = convertToEntity(hotelDTO);
        hotel.setOwner(owner);
        hotel = hotelRepository.save(hotel);
        
        return convertToDTO(hotel);
    }
    
    public HotelDTO updateHotel(Long id, HotelDTO hotelDTO) {
        Hotel existingHotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!existingHotel.getOwner().getId().equals(currentUser.getId()) && !currentUser.getRole().equals("ADMIN")) {
            throw new RuntimeException("You don't have permission to update this hotel");
        }
        
        existingHotel.setName(hotelDTO.getName());
        existingHotel.setDescription(hotelDTO.getDescription());
        existingHotel.setLocation(hotelDTO.getLocation());
        existingHotel.setAddress(hotelDTO.getAddress());
        existingHotel.setPricePerNight(hotelDTO.getPricePerNight());
        existingHotel.setStars(hotelDTO.getStars());
        existingHotel.setImageUrl(hotelDTO.getImageUrl());
        existingHotel.setAmenities(hotelDTO.getAmenities());
        existingHotel.setImages(hotelDTO.getImages());
        existingHotel.setAvailable(hotelDTO.getAvailable());
        
        existingHotel = hotelRepository.save(existingHotel);
        return convertToDTO(existingHotel);
    }
    
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!hotel.getOwner().getId().equals(currentUser.getId()) && !currentUser.getRole().equals("ADMIN")) {
            throw new RuntimeException("You don't have permission to delete this hotel");
        }
        
        hotelRepository.delete(hotel);
    }
    
    public List<HotelDTO> searchHotels(String searchTerm) {
        return hotelRepository.searchHotels(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<HotelDTO> getHotelsByOwner() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User owner = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return hotelRepository.findByOwner(owner).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private HotelDTO convertToDTO(Hotel hotel) {
        HotelDTO dto = new HotelDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setDescription(hotel.getDescription());
        dto.setLocation(hotel.getLocation());
        dto.setAddress(hotel.getAddress());
        dto.setPricePerNight(hotel.getPricePerNight());
        dto.setRating(hotel.getRating());
        dto.setStars(hotel.getStars());
        dto.setImageUrl(hotel.getImageUrl());
        dto.setAvailable(hotel.getAvailable());
        dto.setAmenities(hotel.getAmenities());
        dto.setImages(hotel.getImages());
        
        if (hotel.getOwner() != null) {
            dto.setOwnerId(hotel.getOwner().getId());
            dto.setOwnerName(hotel.getOwner().getFirstName() + " " + hotel.getOwner().getLastName());
        }
        
        return dto;
    }
    
    private Hotel convertToEntity(HotelDTO dto) {
        Hotel hotel = new Hotel();
        hotel.setName(dto.getName());
        hotel.setDescription(dto.getDescription());
        hotel.setLocation(dto.getLocation());
        hotel.setAddress(dto.getAddress());
        hotel.setPricePerNight(dto.getPricePerNight());
        hotel.setRating(dto.getRating());
        hotel.setStars(dto.getStars());
        hotel.setImageUrl(dto.getImageUrl());
        hotel.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);
        hotel.setAmenities(dto.getAmenities());
        hotel.setImages(dto.getImages());
        return hotel;
    }
}