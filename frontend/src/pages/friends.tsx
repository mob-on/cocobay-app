import React, { useState } from "react";
import Card from "src/components/shared/Card";
import Cost from "src/components/shared/Cost";
import styles from "src/styles/pages/friends.module.scss";
import coco from "public/media/coco/coco-pink-swag.svg";
import Image from "next/image";
import Button from "src/components/shared/Button";
import { CopyOutlined } from "@ant-design/icons";
import Link from "next/link";
import { defaultFriends } from "src/components/Friends";
import FriendsList from "src/components/Friends/FriendsList";

const FRIENDS_SHOW_LIMIT = 3;

interface ICard {
  id: number;
  imgSrc: string;
  title: string;
  reward: number;
  secondary?: boolean;
}

const cards: ICard[] = [
  {
    id: 0,
    imgSrc: coco,
    title: "Invite a friend",
    reward: 5000,
    secondary: false,
  },
  {
    id: 1,
    imgSrc: coco,
    title: "Invite a friend with telegram premium",
    reward: 25000,
    secondary: true,
  },
];

export default function Friends() {
  const [friends] = useState(defaultFriends);

  return (
    <>
      <section id="friends" className={styles.friends}>
        <h1>Invite friends!</h1>
        <p>You and your friends will receive bonuses</p>
        <div className={styles.cards}>
          {cards.map((card) => (
            <Card
              className={styles.card}
              key={card.id}
              secondary={card.secondary}
            >
              <>
                <Image
                  className={styles.cardImg}
                  src={card.imgSrc}
                  alt={card.title}
                  width={96}
                  height={96}
                />
                <h5 className={styles.cardTitle}>{card.title}</h5>
                <Cost className={styles.cardReward} cost={card.reward} />
              </>
            </Card>
          ))}
        </div>
        <div className={styles.friendsListTitle}>
          <h3>
            Your friends{" "}
            {friends.length > FRIENDS_SHOW_LIMIT && `(${friends.length})`}
          </h3>
          {friends.length > FRIENDS_SHOW_LIMIT && (
            <Link href="/friends/all">
              <p>View all</p>
            </Link>
          )}
        </div>
        <FriendsList
          className={styles.friendsList}
          friends={friends.slice(0, FRIENDS_SHOW_LIMIT)}
        />
        {!friends.length && (
          <p className={styles.noFriends}>
            No friends yet. Time to change that!
          </p>
        )}
        <div className={styles.buttons}>
          <Button className={styles.button} color="primary" onClick={() => {}}>
            Invite a friend
          </Button>
          <Button
            className={styles.button}
            color="secondary"
            onClick={() => {}}
          >
            <CopyOutlined className={styles.copyIcon} width={48} height={48} />
          </Button>
        </div>
      </section>
    </>
  );
}
