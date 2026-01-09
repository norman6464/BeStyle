package com.example.post.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "post_hashtags", uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "hashtag_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostHashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "post_id", nullable = false)
    private Integer postId;

    @Column(name = "hashtag_id", nullable = false)
    private Integer hashtagId;
}
