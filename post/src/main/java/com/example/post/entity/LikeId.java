package com.example.post.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeId implements Serializable {

    private Post post;
    private Integer userId;
}
