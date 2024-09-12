import React, { useEffect, useState } from "react";
import Card from "frontend/src/components/shared/Card";
import Cost from "frontend/src/components/shared/Cost";
import styles from "frontend/src/styles/pages/friends.module.scss";
import coco from "public/media/coco/coco-pink-swag.svg";
import Image from "next/image";
import Button from "frontend/src/components/shared/Button";
import CopyOutlined from "@ant-design/icons/CopyOutlined";
import Link from "next/link";
import { defaultFriends } from "frontend/src/components/Friends";
import FriendsList from "frontend/src/components/Friends/FriendsList";
import { ICardVariant } from "frontend/src/components/shared/Card/Card";

const FRIENDS_SHOW_LIMIT = 3;

interface ICard {
  id: number;
  imgSrc: string;
  title: string;
  reward: number;
  variant?: ICardVariant;
}

const cards: ICard[] = [
  {
    id: 0,
    imgSrc: coco,
    title: "Invite a friend",
    reward: 5000,
    variant: "default",
  },
  {
    id: 1,
    imgSrc: coco,
    title: "Invite a friend with telegram premium",
    reward: 25000,
    variant: "special",
  },
];

export default function Friends() {
  const [friends] = useState(defaultFriends);
  const [hideLastFriend, setHideLastFriend] = useState(false);

  // If the screen height is less than 890px, hide the last friend.
  // This is the easiest way to do this, and we don't expect screen to be resized, so it's fine.
  useEffect(() => {
    const screenHeight = window.innerHeight;
    if (screenHeight < 930) {
      setHideLastFriend(true);
    }
  }, []);
  const showFriendCount = FRIENDS_SHOW_LIMIT - (hideLastFriend ? 1 : 0);

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
              variant={card.variant}
              type="custom"
            >
              <>
                <Image
                  className={styles.cardImg}
                  src={card.imgSrc}
                  alt={card.title}
                  width={96}
                  height={96}
                  priority
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
            {friends.length > showFriendCount && `(${friends.length})`}
          </h3>
          {friends.length > showFriendCount && (
            <Link href="/friends/all">
              <p>View all</p>
            </Link>
          )}
        </div>
        <FriendsList
          className={styles.friendsList}
          friends={friends.slice(0, showFriendCount)}
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
