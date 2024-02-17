import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      comment: "Great service! Fixed my device in no time.",
      avatar: require("../../assets/mechanic-1.png"), // Replace with actual image path
    },
    {
      id: 2,
      name: "Jane Smith",
      comment: "Professional and friendly team. Highly recommended!",
      avatar: require("../../assets/mechanic-1.png"), // Replace with actual image path
    },
    // Add more testimonials as needed
  ];

  const renderTestimonial = (testimonial: {
    id: number;
    name: string;
    comment: string;
    avatar: any;
  }) => (
    <View key={testimonial.id} style={styles.testimonialCard}>
      <Image source={testimonial.avatar} style={styles.avatar} />
      <Text style={styles.name}>{testimonial.name}</Text>
      <Text style={styles.comment}>{testimonial.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What Our Customers Say</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {testimonialsData.map(renderTestimonial)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  testimonialCard: {
    marginRight: 20,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  comment: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default Testimonials;
