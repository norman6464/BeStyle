package com.example.post.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "post_hashtags")
@IdClass(PostHashtagId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostHashtag {

    @Id
    @Column(name = "post_id", nullable = false)
    private Integer postId;

    @Id
    @Column(name = "hashtag_id", nullable = false)
    private Integer hashtagId;
}
