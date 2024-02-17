import * as React from "react";
import { View, StyleSheet } from "react-native";
import {
  Title,
  Subheading,
  Text,
  Card,
  Avatar,
  IconButton,
} from "react-native-paper";

type TicketProps = {
  title: string;
  subTitle: string;
  description: string;
  avatarImage: string;
  onPress: () => void;
};

const TicketCard: React.FC<TicketProps> = ({
  title,
  subTitle,
  description,
  avatarImage,
  onPress,
}) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title
        title={title}
        subtitle={subTitle}
        left={(props) => (
          <Avatar.Image {...props} source={{ uri: avatarImage }} />
        )}
        right={(props) => (
          <IconButton icon="arrow-right" size={20} onPress={onPress} />
        )}
      />
      <Card.Content>
        <Title>{title}</Title>
        <Subheading>{subTitle}</Subheading>
        <Text>{description}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default TicketCard;
